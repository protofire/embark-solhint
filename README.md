# embark-solhint

A [solhint](https://github.com/protofire/solhint/) plugin for [Embark](https://framework.embarklabs.io/).

## Usage

Install the plugin:

```
npm i --save-dev embark-solhint
```

and add it to your `embark.json`:

```
"plugins": {
  "embark-solhint": {}
}
```

And that's it! When you do `embark run`, if one of your contracts change, you'll get solhint's analysis in the dashboard.
